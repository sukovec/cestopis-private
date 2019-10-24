/// <reference types="node" />

import express = require('express');
import node = require('events');

declare global {
  namespace Express {
    interface SessionData {
        logged: boolean | undefined;
        user: string;
        userId: string;
        admin: boolean | undefined;
    }
  }
}