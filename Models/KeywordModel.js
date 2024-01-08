import mongoose from 'mongoose';

const keywordSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

keywordSchema.pre('save', async function(next) {
    if (!this.isModified('keyword')) next();
    try {
        this.keyword = this.keyword.toLowerCase()
        next()
    } catch(err) {
        next(err)
    }
})

export default mongoose.model('Keyword', keywordSchema);
