/**
 * lib/meal.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import query from './db/query'
import {
  getNumberOfPagesOfMeals,
  getPageOfMeals,
  getMealPhoto,
  getMealPhotoTag,
  updateMealPhoto,
  updateMeal,
  doesMealExist,
  getSteps,
  placeOrder,
  createMeal,
  createMealStep,
  getIngredients,
  createMealRequirement
} from './db/queries'
import etag from 'etag'

exports.pages = async () =>
  parseInt((await query(getNumberOfPagesOfMeals, []))[0].pages, 10)

exports.all = async page => query(getPageOfMeals, [page])

exports.getPhoto = async meal => query(getMealPhoto, [meal])

exports.updatePhoto = async (meal, photo) => query(updateMealPhoto, [photo, etag(photo), meal])

exports.getPhotoTag = async meal => (((await query(getMealPhotoTag, [meal]) || [])[0]) || {}).etag

const MEAL_FIELDS = [
  'name',
  'description',
  'category'
]

exports.updateMeal = async (name, meal) =>
  query(updateMeal, [name].concat(MEAL_FIELDS.map(key => meal[key])))

exports.getSteps = async (meal) => query(getSteps, [meal])
exports.getIngredients = async (meal) => query(getIngredients, [meal])

exports.placeOrder = async (uid, meal, servings) => query(placeOrder, [uid, meal, servings])

exports.create = async (name, description, category) => query(createMeal, [name, description, category])
exports.createStep = async (meal, text, duration) => query(createMealStep, [meal, text, duration])
exports.createRequirement = async (meal, item, quantity) => query(createMealRequirement, [meal, item, quantity])