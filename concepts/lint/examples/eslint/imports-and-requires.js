// Example 1: Import ordering and style
import express from 'express';
import _ from 'lodash';
import path from 'node:path';

import { config } from './config';
import utils from '../utils';

import { readFile } from 'node:fs';

const fs = require('node:fs');

import   {  createServer  }   from   'node:http';

const  http  =  require('node:http');

// Mixing import styles
export default  function  processData (data)  {
    return data.map(item=> item *2);
}

export    const    helper = () =>  {
  console.log('helper function');
};