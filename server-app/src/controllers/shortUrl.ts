import express from "express";
import { UrlModel } from "../model/shortUrl";

export const createUrl = async (req:express.Request, res:express.Response)=>{
    try {
        console.log("Full URL", req.body.fullUrl);
        // const { fullUrl } = req.body.fullUrl;
        const UrlFound = await UrlModel.find({ fullUrl: req.body.fullUrl });
        if(UrlFound.length > 0){
            res.status(409).send(UrlFound);
        } else {
            const shortUrl = await UrlModel.create({ fullUrl: req.body.fullUrl });
            res.status(201).send(shortUrl);
        }
    } catch (error) {
        console.log("error");
        res.status(500).send({message: "Something went wrong"});
    }
};
export const getAllUrl = async (req:express.Request, res:express.Response)=>{
    try {
        const shortUrls = await UrlModel.find().sort({ createdAt: -1 });
        if(shortUrls.length<0){
            res.status(404).send({message: "No Url found"});
        } else {
            res.status(200).send(shortUrls);
        }
    } catch (error) {
        res.status(500).send({message: "Something went wrong"});
    }
};
export const getUrl = async (req:express.Request, res:express.Response)=>{
    try {
        const shortUrl = await UrlModel.findOne({shortUrl: req.params.id})
        if(!shortUrl){
            res.status(404).send({"message": "No url found"})
        }else{
            shortUrl.clicks++;
            shortUrl.save();
            res.redirect(`${shortUrl.fullUrl}`);
        }
    } catch (error) {
        res.status(500).send({message: "Something went wrong"});
    }
};
export const deleteUrl = async (req:express.Request, res:express.Response)=>{
    try {
        const shortUrl = await UrlModel.findByIdAndDelete({_id: req.params.id})
        if(shortUrl){
            res.status(200).send({"message": "Successfully deleted"});
        }
    } catch (error) {
        res.status(500).send({message: "Something went wrong"});
    }
};