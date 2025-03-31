import amqp from 'amqplib';

// URL de conexão com RabbitMQ no CloudAMQP (usando TLS)
const amqpUrl = 'amqps://agggsswr:q6T8LdOrSeXHEG97BwPUyV1SOEjeYj6z@jaragua.lmq.cloudamqp.com/agggsswr';

const sendToQueue = async () => {
  try {
    const connection = await amqp.connect(amqpUrl);
    console.log('Conexão bem-sucedida com RabbitMQ!');

    const channel = await connection.createChannel();
    const queue = 'userQueue';
    const message = JSON.stringify({
      name: 'João',
      email: 'joao@email.com',
      action: 'create'
    });

    // Assegura que a fila existe
    await channel.assertQueue(queue, {
      durable: false
    });

    // Envia a mensagem para a fila
    channel.sendToQueue(queue, Buffer.from(message));

    console.log("Mensagem enviada:", message);

    // Fechar a conexão após um curto tempo
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error('Erro ao conectar ao RabbitMQ:', err);
  }
};

sendToQueue();
