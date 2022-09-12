const fs = require('fs');

const getPicture = (req, res) => {
  const { id } = req.params;
  const picture = pictures.find((picture) => picture.id === id);
  if (!picture) {
    return res.status(404).json({
      message: 'Picture not found',
    });
  }
  res.json(picture);
}