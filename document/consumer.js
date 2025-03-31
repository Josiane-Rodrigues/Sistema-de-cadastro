import amqp from 'amqplib';

const consumeFromQueue = () => {
  const url = 'amqps://agggsswr:q6T8LdOrSeXHEG97BwPUyV1SOEjeYj6z@jaragua.lmq.cloudamqp.com/agggsswr';
  const queue = 'userQueue';

  console.log('Tentando conectar ao RabbitMQ...');

  amqp.connect(url)
    .then(connection => {
      console.log('Conexão estabelecida com RabbitMQ');
      return connection.createChannel();
    })
    .then(channel => {
      console.log('Canal criado com sucesso');
      return channel.assertQueue(queue, { durable: false }).then(() => {
        console.log(`Aguardando mensagens na fila ${queue}...`);

        // Definir prefetch para 1, garantindo que apenas uma mensagem seja consumida por vez
        channel.prefetch(1);

        channel.consume(queue, (message) => {
          if (message) {
            const msgContent = JSON.parse(message.content.toString());
            console.log('Mensagem recebida:', msgContent);

            // Confirmar a mensagem após processamento
            channel.ack(message);
          } else {
            console.log('Nenhuma mensagem recebida');
          }
        });
      });
    })
    .catch(err => {
      console.error('Erro ao conectar ou consumir a fila:', err);
    });
};

consumeFromQueue();
