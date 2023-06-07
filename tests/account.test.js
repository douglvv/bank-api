const {app, server} = require('../index');
const mongoose = require('mongoose');

// Possibilita fazer requisições de teste
// para a API sem precisar iniciar o servidor
const request = require('supertest')



describe('Bank API', () => {
    let accountId1;
    let accountId2;
    let depositId;
    let withdrawId;
    let transferId;


    // função createAccount
    test('deve criar uma conta', async () => {
        const res = await request(app)
            .post('/account/create')
            .send({ name: 'Joao da Silva', cpf: '11122233344' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'Joao da Silva');
        expect(res.body).toHaveProperty('cpf', '11122233344');

        accountId1 = res.body._id; // Salva o id criado na variável global
    });

    test('deve criar outra conta', async () => {
        const res = await request(app)
            .post('/account/create')
            .send({ name: 'Nome Qualquer', cpf: '55566677788' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'Nome Qualquer');
        expect(res.body).toHaveProperty('cpf', '55566677788');

        accountId2 = res.body._id; // Salva o id criado na variável global
    });

    test('deve tentar criar uma conta com cpf já registrado', async () => {
        const res = await request(app)
            .post('/account/create')
            .send({ name: 'Joao da Silva', cpf: '11122233344' });

        expect(res.statusCode).toBe(409);
        expect(res.text).toBe('Cpf already registered.');
    });

    // função showAccount
    test('deve consultar uma conta baseado no id', async () => {
        const res = await request(app).get(`/account/${accountId1}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', `${accountId1}`);
    })

    // função deposit
    test('deve depositar R$123.456,78', async () => {
        const res = await request(app)
            .post(`/account/${accountId1}/deposit`)
            .send({ value: '123456.78' });

        depositId = res.body.transactions[0] // Salva a id da transação

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', `${accountId1}`)
        expect(res.body).toHaveProperty('balance', '123456.78')
        expect(res.body.transactions).toContain(`${depositId}`)
    })

    // função withdraw
    test('deve sacar R$100.000,00', async () => {
        const res = await request(app)
            .post(`/account/${accountId1}/withdraw`)
            .send({ value: '100000' })

        withdrawId = res.body.transactions[1]

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('balance', '23456.78')
        expect(res.body.transactions).toContain(`${withdrawId}`)
    })

    test('deve tentar sacar um valor maior que o saldo', async () => {
        const res = await request(app)
            .post(`/account/${accountId1}/withdraw`)
            .send({ value: '9999999999' })

        expect(res.statusCode).toBe(403);
        expect(res.text).toBe('Not enough balance.');
    })

    // função editAccount
    test('deve editar os dados da conta', async () => {
        const res = await request(app)
            .post(`/account/${accountId1}/edit`)
            .send({ name: "Nome Alterado", cpf: "00099988877" })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', "Nome Alterado");
        expect(res.body).toHaveProperty('cpf', "00099988877");
    })

    test('deve tentar editar a conta sem passar parâmetros', async () => {
        const res = await request(app).post(`/account/${accountId1}/edit`)

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('No parameter specified for edit.')
    })

    // função transfer
    test('conta 1 deve transferir R$10.000,00 para conta 2', async () => {
        const res = await request(app)
            .post(`/account/${accountId1}/transfer`)
            .send({ idReceiver: accountId2, value: '10000' });

        transferId = res.body._id

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('type', 'transfer');
        expect(res.body).toHaveProperty('value', '10000');
        expect(res.body.participants).toHaveProperty('payer', `${accountId1}`);
        expect(res.body.participants).toHaveProperty('receiver', `${accountId2}`);
    })

    // função showStatement
    test('deve consultar o extrato da conta 2', async () => {
        const res = await request(app).get(`/account/${accountId2}/statement`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty('type', 'transfer');
        expect(res.body[0]).toHaveProperty('value', '10000');
        expect(res.body[0]).toHaveProperty('_id', `${transferId}`);

    })

    // função deleteAccount
    test('deve apagar a conta 1', async () => {
        const res = await request(app).post(`/account/${accountId1}/delete`);

        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Conta cancelada com sucesso!');
    })

});

// Fecha o servidor e a conexão com o banco
afterAll(async () => { 
    await mongoose.connection.close();
    server.close()
});

