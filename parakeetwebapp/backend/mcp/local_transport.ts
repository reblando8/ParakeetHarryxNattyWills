import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
type MessageHandler = (message: JSONRPCMessage) => void;

export class local_transport implements Transport {
    private twinLocalTransport?: local_transport;

    addTwin(twinLocalTransport: local_transport) {
        this.twinLocalTransport = twinLocalTransport;
    }

    /// Start the transport layer and set the message handler
    start(): Promise<void> {
        throw new Error("Method not implemented.");
        return Promise.resolve();
    }

    /// Send a message to the peer (other side of local transport)
    send(message: JSONRPCMessage): Promise<void> {
       this.twinLocalTransport?.onmessage?.(message);
       return Promise.resolve();
    } 

    /// Close the transport
    close(): Promise<void> {
        throw new Error("Method not implemented.");
        return Promise.resolve();
    }

    onclose?: (() => void) | undefined;
    onerror?: ((error: Error) => void) | undefined;
    onmessage?: ((message: JSONRPCMessage) => void) | undefined;
    sessionId?: string | undefined;
}
