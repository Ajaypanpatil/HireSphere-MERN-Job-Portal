import User from "../models/User.js";

export const registerUser = async (req, res) => {

    const {name, email, password, role} = req.body;

    if(!name || !email || !password || !role){
        return res.status(400).json({message : "All fields are required"})
    }

    if (!['candidate', 'recruiter'].includes(role)) {
    return res.status(400).json({ message: 'Role must be candidate or recruiter.' });
  }

  try{

    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(409).json({ message: "Email already in use"});
    }

    const user = new User({
        name,
        email,
        password,
        role
    })

    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });

  }catch(error){
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
