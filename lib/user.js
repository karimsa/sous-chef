/**
 * lib/user.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import query from './db/query'
import { findUserByLogin } from './db/queries'

exports.login = async (user, pass) => query(findUserByLogin, [user, pass])