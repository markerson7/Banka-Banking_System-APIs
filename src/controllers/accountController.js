// src/controllers/accountController.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024

const Account = require('../models/Account');
const User = require('../models/User');

//Generate a random account number
const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
};

exports.createAccount = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(400).json({status: 400, error: 'User not found'});

        const accountNumber = generateAccountNumber();
        const { type } = req.body;
        const newAccount = await Account.create({
            accountNumber,
            owner: user._id,
            type,
            status: 'active',
            balance: req.body.balance || 0
        });

        res.status(201).json({
            status: 201,
            data: {
                accountNumber: newAccount.accountNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                type: newAccount.type,
                openingBalance: newAccount.balance
            }
        });
    }catch(error){
        next(error);
    }
};


exports.updateAccountStatus = async (req, res, next) => {
    try{
        const { accountNumber } = req.params;
        const { status } = req.body;
        const account = await Account.findOne({ accountNumber });
        if(!account) return res.status(400).json({status: 400, error: 'Account not found'});

        account.status = status;
        await account.save();

        res.status(200).json({
            status: 200,
            data: {
                accountNumber: account.accountNumber,
                status: account.status
            }
        });
    }catch(error){
        next(error);
    }
};


exports.deleteAccount = async (req, res, next) => {
    try{
        const { accountNumber } = req.params;
        const account = await Account.findOneAndDelete({ accountNumber });
        if (!account) return res.status(404).json({ status: 404, error: 'Account not found'});

        res.status(200).json({
            status: 200,
            message: 'Account Successfully deleted'
        });
    }catch(error){
        next(error);
    }
};


exports.getUserAccounts = async (req, res, next) => {
    try {
      const { email } = req.params;
      
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ status: 404, error: 'User not found' });
      }
      
      const accounts = await Account.find({ owner: user._id });
      res.status(200).json({
        status: 200,
        accounts
      });
    } catch (error) {
        console.error('Error in getUserAccounts:', error);
      next(error);
    }
};


exports.getAccountDetails = async (req, res, next) => {
    try {
      const { accountNumber } = req.params;
      const account = await Account.findOne({ accountNumber }).populate('owner', 'email');
      if (!account) return res.status(404).json({ status: 404, error: 'Account not found' });
  
      res.status(200).json({
        status: 200,
        data: {
          createdOn: account.createdOn,
          accountNumber: account.accountNumber,
          ownerEmail: account.owner.email,
          type: account.type,
          status: account.status,
          balance: account.balance
        }
      });
    } catch (error) {
      next(error);
    }
};


exports.getAllAccounts = async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        const accounts = await Account.find(query).populate('owner', 'email');
        
        res.status(200).json({
            status: 200,
            data: accounts
      });
    } catch (error) {
      next(error);
    }
};


exports.getAccountTransactions = async (req, res, next) => {
    try {
        const { accountNumber } = req.params;
        const Transaction = require('../models/Transaction');
        const transactions = await Transaction.find({ accountNumber });
       
        res.status(200).json({
            status: 200,
            data: transactions
      });
    } catch (error) {
      next(error);
    }
  };