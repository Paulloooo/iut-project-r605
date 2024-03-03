// consumer.js
const RabbitMQ = require('../lib/rabbitmq');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lelah.orn2@ethereal.email',
        pass: 'YeXgCWmE5mark57147'
    }
});

const knex = require('knex')({
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'neuille',
        password: process.env.DB_PASSWORD || 'frere',
        database: process.env.DB_DATABASE || 'user',
        port: 3308
    }
});


async function startConsumer() {
    await RabbitMQ.connect();
    await RabbitMQ.consumeFromQueue('export-csv-request', async (message) => {
        try {
            let allMovies = await knex('movie').select('*');

            const csvWriter = createCsvWriter({
                path: 'movies.csv',
                header: [
                    { id: 'title', title: 'Title' },
                    { id: 'director', title: 'Director' },
                    { id: 'description', title: 'Description' },
                    { id: 'releaseDate', title: 'Release Date' },
                ],
            });

            await csvWriter.writeRecords(
                allMovies.map((movie) => ({
                    title: movie.title,
                    director: movie.director,
                    description: movie.description,
                    releaseDate: movie.releaseDate,
                }))
            );
            const mailOptions = {
                from: 'lelah.orn2@ethereal.email',
                to: 'paul.biarneix@gmail.com',
                subject: 'Export CSV des films',
                text: 'Voici le fichier CSV des films en pièce jointe.',
                attachments: [
                    {
                        filename: 'movies.csv',
                        path: 'movies.csv',
                    },
                ],
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Erreur lors de la génération du fichier CSV :', error);
        }
    });
}

module.exports = { startConsumer };
