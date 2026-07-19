import http from 'http';
import axios from 'axios';
import { EventEmitter } from 'events';

export interface BackendServer {
    url: string;
    isAlive:boolean;
}

export interface RouteEvent {
    target: string;
    path: string;
    method: string;
    timestamp: number;
}

export interface HealthEvent {
    url: string;
    isAlive: boolean;
}


export class LoadBalancer extends EventEmitter {
    private backends: BackendServer[];
    private currentIndex: number = 0;
    private frontendClients: http.ServerResponse[] = [];

    constructor(backendUrls: string[]) {
        super();
        this.backends = backendUrls.map(url => ({ url,isAlive: true }));

        setInterval(() => this.healthCheck(), 5000);
    }

    private getNextServer(): BackendServer | null {
        const aliveServers = this.backends.filter(b => b.isAlive);
        if (aliveServers.length === 0) return null;

        const server = aliveServers[this.currentIndex % aliveServers.length];
        this.currentIndex= (this.currentIndex + 1) % aliveServers.length;
        return server;
    }

    private async healthCheck() {
        for (const server of this.backends) {
            try {
                await axios.get(`${server.url}/health`, { timeout:1500});

                if (!server.isAlive) {
                    server.isAlive = true;
                    this.emit('health-changed', { url:server.url, isAlive: false } as HealthEvent);
                }
            }
        }
    }

    public registerFrontendClient(res:http.ServerResponse) {
        res.writeHead(200,{
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        this.frontendClients.push(res);

        res.write(`event: init\n`);
        res.write(`data: ${JSON.stringify(this.backends)}\n\n`);

        res.on('close',()=> {
            this.frontendClients = this.frontendClients.filter(client => client!==res);
        });
    }

    public broadcast(event:string, data:any) {
        this.frontendClients.forEach(client => {
            client.write(`event: ${event}\n`);
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }

    public start(port: number) {
        http.createServer(async (req, res)  => {
            if (req.url === '/stream-stats') {
                this.registerFrontendClient(res);
                return;
            }

            const target = this.getNextServer();

            if (!target) {
                res.writeHead(503, {'Content-Type': 'text/plain'});
                return res.end('Service not available');
            }

            this.emit('request-routed', {
                target: target.url,
                path: req.url || '/',
                method: req.method||'GET',
                timeStamp: Date.now()
            } as RouteEvent );

            try {
                const response = await axios({
                    method: req.method,
                    url: `${target.url}${req.url}`,
                    headers: req.headers as any,
                    data: req,
                    validateStatus: () =>true
                });
                res.writeHead(response.status, response.headers as any);
                res.end(typeof response.data === 'object'? JSON.stringify(response.data) : response.data );
            } catch (err: any) {
                res.writeHead(500);
                res.end(`Proxy Error: ${err.message}`);
            }
        }).listen(port, () => {
            console.log(`Load Balancer běží na portu ${port}`)
        });
    }
}