// Example 1: Import ordering and style
import {readFile} from "fs"
import express from "express"
import path from 'path';
import   {  createServer  }   from   'http'
import _ from "lodash"
import {config} from "./config"
import utils from "../utils"

const fs = require("fs")
const  http  =  require( 'http' )

// Mixing import styles
export default  function  processData (data)  {
    return data.map(item=> item *2 )
}

export    const    helper = (  ) =>  {
  console.log( "helper function" )
}