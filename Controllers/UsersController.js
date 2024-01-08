import User from '../Models/UserModel.js';

const UserController = {
  getAll: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  getById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  create: async (req, res) => {
    const user = new User(req.body);
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      let allowedUpdateFields = []
      if (req.user.userRole === 'admin')
        allowedUpdateFields = [ 'username', 'password', 'role', 'email', 'vs_currency' ];
      else
        allowedUpdateFields = [ 'username', 'password', 'email', 'vs_currency'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.
          every((update) => allowedUpdateFields.
              includes(update));
      if (!isValidOperation) {
        return res.status(400).json({message: 'Invalid updates!'});
      }
      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      res.json({message: 'User deleted'});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },
  getUserRole: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: 'User not found' });
      res.status(200).send( { role: user.role, id: user._id } );
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  getAllUserCrypto: async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ cryptos: user.cryptos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
,

  add_crypto_to_user: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user.cryptos.includes(req.params.cryptoId)) {
        user.cryptos.push(req.params.cryptoId);
        await user.save();
        res.status(200).json("Crypto added to user.");
      } else {
        res.status(400).json("Crypto already exists for user.");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  remove_crypto_from_user: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      user.cryptos = user.cryptos.filter(cryptoId => cryptoId.toString() !== req.params.cryptoId);
      await user.save();
      res.status(200).json("Crypto removed from user.");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
export default UserController;
