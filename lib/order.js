/**
 * lib/order.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import query from './db/query'
import {
  getNumberOfPagesOfOrdersOfAdmin,
  getPageOfOrdersOfAdmin,
  getNumberOfPagesOfOrdersOfChef,
  getPageOfOrdersOfChef,
  rejectOrder,
  approveOrder,
  completeOrder
} from './db/queries'

exports.pagesadmin = async () =>
  parseInt((await query(getNumberOfPagesOfOrdersOfAdmin, []))[0].pages, 10)

exports.alladmin = async page => query(getPageOfOrdersOfAdmin, [page])

exports.pageschef = async () =>
  parseInt((await query(getNumberOfPagesOfOrdersOfChef, []))[0].pages, 10)

exports.allchef = async page => query(getPageOfOrdersOfChef, [page])

exports.reject = async (uid, meal) => query(rejectOrder, [uid, meal])
exports.approve = async (uid, meal) => query(approveOrder, [uid, meal])
exports.complete = async (uid, meal) => query(completeOrder, [uid, meal])