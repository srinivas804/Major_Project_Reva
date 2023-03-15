# xcoin cryptocurrencey

# to be installed: 
# pip install Flask==0.12.2 (Anaconda prompt)
# postman http client: https://www.postman.com/downloads/
# pip install requests==2.18.4

#import libraries
#import timestamp
# for hashing
# for encrypting
#for testing and interacting
import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse

#part 1- Building a blockchain

class Blockchain:
 
# my blockchain 
    def __init__(self):
        #appending the blocks that are mined
        self.chain = []
        #list of transactions before being appended
        self.transactions =[]
        #genesis block
        self.create_block(proof = 1, previous_hash = '0')
        # nodes (p2p network)
        self.nodes = set()
        
#creating next block
    def create_block(self, proof, previous_hash):
        block = {'index': len(self.chain)+1, 
                 'timestamp': str(datetime.datetime.now()), 
                 'proof': proof, 
                 'transactions': self.transactions, 
                 'previous_hash': previous_hash, 
                }#add data
        # emptying list after transactions are added to the list
        self.transactions = []
        self.chain.append(block)
        return block
 # to get previous block 
    def get_previous_block(self):
        return self.chain[-1]
# proof of work
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
# we check for two things in order to check if our block chain is fully functional:
#check1: is proof of work satisfied
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof +=1
        return new_proof;
# create hash code for the block
    def hash(self, block):
         encoded_block = json.dumps(block, sort_keys = True).encode()
         return hashlib.sha256(encoded_block).hexdigest()
#check2: is previous_hash == previous?_block(hash)
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if  hash_operation[:4] != '0000':
                return False
            previous_block  = block
            block_index += 1
        return True
#-------------------------------------------make changes in below function--------------------------------------
    
# creating new transaction that'll be added to the list   
    def add_transaction(self, sender, reciever, amount):
        self.transactions.append({'sender': sender,
                                  'reciever': reciever, 
                                  'amount': amount})
        previous_block = self.get_previous_block()
        return previous_block['index']+1
        
# adding nodes in network    
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        
# consensus protocol (not of importance in our project)
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length >= length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False

#------------------------------ecpc verification function to be added---------------------------------
        
#part 2- mining the blockchain

# creating a Web App
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

#creating an address for the node on port 5000
node_address = str(uuid4()).replace('-', '')


# creating a blockchain instance
blockchain = Blockchain()

#----------------changes to be made in below function (ecpc function call, should return status)-----------------

# mining a new block
@app.route('/mine_block', methods = ['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    blockchain.add_transaction(sender = node_address, reciever = 'Nasser', amount = 5)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof, previous_hash)
    response = {'message': 'Congractulations, you just mined a block', 
                'index': block['index'], 
                'timestamp': block['timestamp'], 
                'proof': block['proof'], 
                'transactions': block['transactions'],
                'previous_hash': block['previous_hash']}
    return jsonify(response), 200
# getting the full block
@app.route('/get_chain', methods = ['GET'])
def get_chain():
    response = {'chain': blockchain.chain, 
                'length': len(blockchain.chain)}
    return jsonify(response), 200
#request to chechk if blockchain is valid
@app.route('/is_valid', methods = ['GET'])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message': 'all good. The BlockChain is valid.'}
    else: 
        response = {'message': 'invalid BlockChain!'}
    return jsonify(response), 200

# adding a new transaction to the blockchain

#------------------------changes required below (ecpc function call)---------------------------------

@app.route('/add_transaction', methods = ['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = ['sender', 'reciever', 'amount']
    if not all (key in json for key in transaction_keys):
        return 'some elements of the transactions are missing', 400
    index = blockchain.add_transaction(json['sender'], json['reciever'], json['amount'])
    response = {'message': f'this transaction will be added to block {index}'}
    return jsonify(response), 201

# part 3- decentralizing our blockchain

# connecting new nodes
@app.route('/connect_node', methods = ['POST'])
def connect_node():
    json  = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'all the nodes are now connected. the blocckchain now contains the following nodes', 
                'total_nodes': 'list(blockchain.nodes)'}
    return jsonify(response), 201

# replace chain by longest chain if needed
@app.route('/replace_chain', methods = ['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {'message': 'Chain updated successfully!', 
                    'new_chain': blockchain.chain }
    else: 
        response = {'message': 'The chain is the longest one', 
                    'actual_chain': blockchain.chain }
    return jsonify(response), 200

# running the app
app.run(host = '0.0.0.0', port = 5000)
