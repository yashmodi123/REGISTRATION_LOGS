const logService = require('../services/log.service');
const { validationResult } = require('express-validator');

const getLogs = async (req, res, next) => {
  try {
    const logs = await logService.getLogs(req.query);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const createErrorLog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const log = await logService.createErrorLog(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs, createErrorLog };
