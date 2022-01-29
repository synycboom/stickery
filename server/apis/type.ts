import express from 'express';

type ExpressRequest = typeof express.request;

export interface ExtendedRequest extends ExpressRequest {
  userId?: number
  publicAddress?: string
}
