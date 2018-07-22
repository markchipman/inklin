#!/usr/local/bin/ruby

# Used to export Blocks from a Web3 compatible endpoint
# I use:
# geth --rpc --rpccorsdomain http://localhost:8080 --fast

# Need to add a unique index for tx 
# db.transactions.createIndex({"hash":1},{unique:1})
# Last imported block:
#
# db.transactions.find().sort({"block_number": 1}).limit(1)

require 'web3/eth'
require 'mongoid'


$stdout.sync = true

force_sync = ARGV[0]

#force_sync = "yes"

# Lazy initialise the Transaction class

class Transaction
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end

Mongoid.load!("./mongoid.yml", :development)


web3 = Web3::Eth::Rpc.new #host: 'parity-service'
 
begin
    syncing = web3.eth.syncing
    last_block = syncing["currentBlock"].to_i(16)
rescue => exception
    last_block = web3.eth.blockNumber
end 

last_block = 5478241 

 
# Dups
# Block 5018425  2018-02-02 17:24:49 +0000
# Block 5018418  2018-02-02 17:23:40 +0000
# Block 5018412  2018-02-02 17:21:40 +0000
# Block 5018407  2018-02-02 17:19:39 +0000
# Block 5018400  2018-02-02 17:17:33 +0000
# Block 5018394  2018-02-02 17:16:21 +0000
# Block 5018388  2018-02-02 17:14:51 +0000
# Block 5018380  2018-02-02 17:13:45 +0000
# Block 5018370  2018-02-02 17:11:49 +0000
# Block 5018365  2018-02-02 17:10:54 +0000

all_transactions = []

transactions = []

until last_block == 5702279

    begin

        block = web3.eth.getBlockByNumber(last_block, true)
        for tx in block.transactions
            # Is this a token contract?
            if tx.input.match(/^0xa9059cbb/) 
                type = "token"
            else
                type = ""
            end

            tx = {:type => type, :partition => last_block % 20, :hash => tx.hash, :block_number => last_block, :block_time => block.timestamp_time, :from => tx.from, :to => tx.to, :value => tx.value_eth, :data => tx.input}
            puts tx.to_json
        end

        # if transactions.length > 1000
        #     #Transaction.collection.insert_many(transactions)  
        #     puts("Block #{last_block}  #{block.timestamp_time}")
        #     transactions = []
        # end

        last_block+=1   

    rescue => exception
        puts(exception)
        transactions = []

        last_block+=1            
        next
    end

    # begin
    #     last_block+=1   
    #     if transactions.length > 10000         
    #         Transaction.collection.insert_many(transactions)  
    #         puts("Block #{transactions[0].block_number} to  #{transactions.last.block_number} #{block.timestamp_time}")
    #         transactions = []
    #     end
    # rescue Mongo::Error::BulkWriteError => exception
    #     if force_sync.nil?
    #         puts("Hitting existing block...retrying")
    #         sleep(1)
    

    #         begin
    #             syncing = web3.eth.syncing
    #             last_block = syncing["currentBlock"].to_i(16)
    #             puts(last_block)

    #         rescue => exception
    #             last_block = web3.eth.blockNumber
    #             puts(last_block)
    #         end
    #                 else
    #         puts "Skipping #{last_block+1}"
    #     end
    # end
end
