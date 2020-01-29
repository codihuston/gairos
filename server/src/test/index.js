/**
 * Implement any SYNCHRONOUS environment pre-configuration for tests here as
 * needed. This file is executed prior to all files.
 * ASYNCHRONOUS operations are not supported.
 */
// work around for removing harmless error when loading sequelize during tests
// see: https://github.com/sequelize/sequelize/issues/3781#issuecomment-522198459
import pg from "pg";
delete pg.native;
