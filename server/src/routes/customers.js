import express from "express";
import {getCustomers, getCustomer,createCustomer ,updateCustomerInfo, deleteCustomer} from "../controllers/customers.js";

const router = express.Router();

router.get('/',getCustomers);
router.get('/:id',getCustomer);
router.post('/',createCustomer)
router.put('/:id',updateCustomerInfo);
router.delete('/:id',deleteCustomer);

export default router;