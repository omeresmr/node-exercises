export const register = (req, res) => {
  const { email, password, name } = req.body;

  console.log(email, password, name);

  res.status(201).json({ message: 'User registered' });
};
