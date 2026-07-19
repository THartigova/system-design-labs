import { LoadBalancer } from './balancer';


const lb = new LoadBalancer([
    'http://localhost:5001',
    'http://localhost:5002',
    'http://localhost:5003'
]);


lb.on('request-routed', (data) => {
    console.log(`🔀 Request směrován na: ${data.target} (${data.path})`);
    lb.broadcast('request-routed', data);
});

lb.on('health-changed', (data) => {
    const icon = data.isAlive ? '🟢' : '🔴';
    console.log(`${icon} Změna stavu serveru ${data.url}: ${data.isAlive ? 'ONLINE' : 'OFFLINE'}`);
    lb.broadcast('health-changed', data);
});

lb.start(8000);