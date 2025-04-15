const { body, param } = require('express-validator');

// Validation for creating a profile
const validateCreateProfile = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),
  body('webhookUrl')
    .optional()
    .isURL()
    .withMessage('Webhook URL must be a valid URL'),
  body('enableWebhook')
    .optional()
    .isBoolean()
    .withMessage('Enable webhook must be a boolean')
];

// Validation for updating a profile
const validateUpdateProfile = [
  param('id')
    .notEmpty()
    .withMessage('Profile ID is required')
    .isInt()
    .withMessage('Profile ID must be an integer'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),
  body('webhookUrl')
    .optional()
    .isURL()
    .withMessage('Webhook URL must be a valid URL'),
  body('enableWebhook')
    .optional()
    .isBoolean()
    .withMessage('Enable webhook must be a boolean')
];

// Validation for sending a private message
const validateSendPrivateMessage = [
  body('profileId')
    .notEmpty()
    .withMessage('Profile ID is required')
    .isInt()
    .withMessage('Profile ID must be an integer'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Phone number must be a string'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
];

// Validation for sending a group message
const validateSendGroupMessage = [
  body('profileId')
    .notEmpty()
    .withMessage('Profile ID is required')
    .isInt()
    .withMessage('Profile ID must be an integer'),
  body('groupId')
    .notEmpty()
    .withMessage('Group ID is required')
    .isString()
    .withMessage('Group ID must be a string'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
];

module.exports = {
  validateCreateProfile,
  validateUpdateProfile,
  validateSendPrivateMessage,
  validateSendGroupMessage
};
