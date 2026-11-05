import {test, expect} from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let bookingId;
let authToken;
let testData = 
{
    "firstname": "Jane",
    "lastname": "Doe",
    "totalprice": 253,
    "depositpaid": true,
    "bookingdates": 
    {
        "checkin": "2026-11-02",
        "checkout": "2026-11-16"
    },
    "additionalneeds": "Late check-in"
}

test.describe('API тесты для Restful-booker @api', () => {
    const baseURL = 'https://restful-booker.herokuapp.com';

    test('Создание бронирования', async ({ request }) => {
        const response = await request.post(`${baseURL}/booking`,
            {
                headers: { 'Content-Type': 'application/json' },
                data: testData
            }
        );
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('bookingid');
        bookingId = responseBody.bookingid;
        expect(responseBody.booking).toMatchObject(testData);
    });

    test('Получение бронирования', async ({ request }) => {
        const response = await request.get(`${baseURL}/booking/${bookingId}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject(testData);
    });

    test('Обновление бронирования', async ({ request }) => {
        let updatedData = testData;
        updatedData.firstname = "John";
        updatedData.depositpaid = false;

        const responsePOST = await request.post(`${baseURL}/auth`,
            {
                headers: { 'Content-Type': 'application/json' },
                data: 
                {
                    username: 'admin',
                    password: 'password123'
                }
            });
        authToken = (await responsePOST.json()).token;

        const responsePUT = await request.put(`${baseURL}/booking/${bookingId}`, 
            {
                headers: 
                {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${authToken}`
                },
                data: updatedData
            }
        );
        expect(responsePUT.status()).toBe(200);
        const responseBody = await responsePUT.json();
        expect(responseBody).toMatchObject(updatedData);
    });

    test('Удаление бронирования', async ({ request }) => {
        const responseDELETE = await request.delete(`${baseURL}/booking/${bookingId}`,
            {
                headers: 
                {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${authToken}`
                }
            }
        );
        expect(responseDELETE.status()).toBe(201);

        const responseGET = await request.get(`${baseURL}/booking/${bookingId}`);
        expect(responseGET.status()).toBe(404);
    });
});