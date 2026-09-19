export const getOne = (Model, populate = "") => async (req, res) => {
  try {
    let query = Model.findOne();
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) {
      return res.status(404).json({ mensaje: "No encontrado" });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.json(doc);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

export const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear", error: error.message });
  }
};

export const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ mensaje: "No encontrado" });
    }
    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};

export const getAll = (Model, populate = "", sort = { createdAt: -1 }) => async (req, res) => {
  try {
    let query = Model.find().sort(sort);
    if (populate) query = query.populate(populate);
    const docs = await query;
    res.json(docs);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor", error: error.message });
  }
};

export const updateById = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ mensaje: "No encontrado" });
    }
    res.json(doc);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};