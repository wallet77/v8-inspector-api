'use strict'

/** @typedef {import('@aws-sdk/client-s3').S3ClientConfig} S3ClientConfig */

/**
 * @typedef {object} StorageConfig
 * @property {'raw' | 'fs' | 's3'} type
 * @property {string} [bucket] S3 bucket (required when type is 's3')
 * @property {string} [dir] S3 key prefix (required when type is 's3')
 */

/**
 * @typedef {object} InspectorConfig
 * @property {StorageConfig} [storage]
 * @property {S3ClientConfig} [aws]
 */

/**
 * @typedef {object} ResolvedConfig
 * @property {StorageConfig} storage
 * @property {S3ClientConfig} aws
 */

module.exports = {}
