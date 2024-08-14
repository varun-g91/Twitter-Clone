export const errorHandler = (err, res) => {
    console.log(err);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
};
