// import { createRequire } from 'module'; 
// const require = createRequire(import.meta.url);
const GRPCClient = require('./PandaDBDriver');
// import GRPCClient from "./PandaDBDriver"
const request = {
  async fetchData(address, statement) {
    const client = new GRPCClient(address);
    const stream = client.query(statement);
    stream.on('data', (response) => {
      console.log('Received response:', response.resultInJson);
      return response.resultInJson
    });

    stream.on('end', () => {
      console.log('Query finished.');
      return 'Query finished.'
    });

    stream.on('error', (err) => {
      console.error('Error:', err);
      return err
    });

  },
};
export default request

