var PROTO_PATH = './Query.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
class GRPCClient {
    constructor(address) {
        this.address = address;
        this.protoDescriptor = this.loadProto();
        this.client = new this.protoDescriptor.org.grapheco.pandadb.network.PandaQueryService(
            address, grpc.credentials.createInsecure()
        );
    }

    loadProto() {
        var packageDefinition = protoLoader.loadSync(
            PROTO_PATH,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            }
        );
        return grpc.loadPackageDefinition(packageDefinition);
    }

    query(statement) {
        let map = new Map();
        return this.client.QueryWithJson({ statement: statement }, { parameters: map });
    }
}

module.exports = GRPCClient;
