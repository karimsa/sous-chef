/**
 * lib/item.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import query from './db/query'
import {
  getNumberOfPagesOfItems,
  getPageOfItems,
  getItemPhoto,
  getItemPhotoTag,
  updateItemPhoto,
  updateItem,
  doesItemExist,
  getAllItems
} from './db/queries'
import etag from 'etag'

exports.pages = async uid => {
  return parseInt((await query(getNumberOfPagesOfItems, [uid]))[0].pages, 10)
}

exports.all = async (uid, page) => query(getPageOfItems, [uid, page])
exports.getAll = async () => query(getAllItems, [])

exports.getPhoto = async (uid, item) => query(getItemPhoto, [uid, item])

exports.updatePhoto = async (uid, item, photo) => query(updateItemPhoto, [photo, etag(photo), uid, item])

exports.getPhotoTag = async (uid, item) => (((await query(getItemPhotoTag, [uid, item]) || [])[0]) || {}).etag

const ITEM_FIELDS = [
  'name',
  'category',
  'available',
  'threshold',
  'amountnew',
  'price'
]

exports.updateItem = async (uid, name, item) =>
  query(updateItem, [uid, name].concat(ITEM_FIELDS.map(key => item[key])))