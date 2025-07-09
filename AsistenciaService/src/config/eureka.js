import { Eureka } from 'eureka-js-client';
import dotenv from 'dotenv';

dotenv.config();

const client = new Eureka({
  instance: {
    app: process.env.EUREKA_APP_NAME,
    instanceId: `${process.env.EUREKA_APP_NAME}-${process.env.PORT}`,
    hostName: process.env.HOSTNAME,
    ipAddr: process.env.HOSTNAME,
    port: {
      '$': process.env.EUREKA_INSTANCE_PORT,
      '@enabled': true,
    },
    vipAddress: process.env.EUREKA_APP_NAME,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST,
    port: process.env.EUREKA_PORT,
    servicePath: '/eureka/apps/',
  },
});

export default function registerWithEureka() {
  client.logger.level('debug');
  client.start(err => {
    if (err) {
      console.error('❌ Error registrando en Eureka:', err);
    } else {
      console.log('✅ Registrado en Eureka como', process.env.EUREKA_APP_NAME);
    }
  });
}
