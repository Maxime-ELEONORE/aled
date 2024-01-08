import User from '../Models/UserModel.js';

async function initializeAdminUser() {
  try {
    const adminExists = await User.findOne({role: 'admin'});
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        password: 'P@ssw0rdP@ssw0rd',
        email: 'admin@mail.fr',
        role: 'admin',
      });
      await adminUser.save();
      console.log('Compte administrateur créé');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur', error);
  }
};

export default initializeAdminUser;
