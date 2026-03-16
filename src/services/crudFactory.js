const createCrudController = (Model) => ({
  create: async (req, res, next) => {
    try {
      const data = await Model.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },
  list: async (_req, res, next) => {
    try {
      const data = await Model.find().sort({ createdAt: -1 });
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
});

module.exports = createCrudController;
