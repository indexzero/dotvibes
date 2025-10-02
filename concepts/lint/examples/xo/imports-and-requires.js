// Example 1: Import ordering and style
import { readFile } from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import express from 'express';
import _ from 'lodash';
import utils from '../utils';
import { config } from './config';
const fs = require('node:fs');
const http = require('node:http');

// Mixing import styles
export default function processData(data) {
  return data.map(item => item * 2);
}

export const helper = () => {
  console.log('helper function');
};
