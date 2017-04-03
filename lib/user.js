/**
 * lib/user.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import query from './db/query'
import { findUserByLogin, findUserByName } from './db/queries'

exports.login = async (user, pass) => query(findUserByLogin, [user, pass])

exports.name2id = async (name) => (await query(findUserByName, [name]))[0].uid