/**
 * Created by zoey on 2015/6/11.
 */
var formidable=require('formidable');
var adDao = require('../dao/ad');
var fairDao = require('../dao/fair');
var response = require('../common/response');
var util = require('../common/util');
exports.save=function (req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files.adlogofile) {
            var file=files.adlogofile;
            util.handleUpload(file,function(err,name){
                if (err) {
                    return res.json(response.buildError('Something went wrong!'));
                } else {
                    if(fields){
                        if(name!=null) {
                            fields.pic = name;
                        }
                        save(fields,res)
                    }
                }
            })
        } else {
            save(fields,res);
        }
    });
};
var save=function(fields,res){
    //保存广告
    adDao.save(fields,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        //更新fair
        fairDao.addAd(fields.fairId,fields.type,doc._id,function(err,doc){
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        })
    });
}
exports.find=function (req, res) {
    adDao.find(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.update=function (req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files) {
            var file=files.adlogofile;
            util.handleUpload(file,function(err,name){
                if (err) {
                    return res.json(response.buildError('Something went wrong!'));
                } else {
                    if(fields){
                        if(name!=null) {
                            fields.pic = name;
                        }
                        adDao.update(fields,function(err,list){
                            if(err){
                                console.log(err)
                                return res.json(response.buildError(err));
                            }
                            res.json(response.buildOK());
                        });
                    }
                }
            })
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
    });
};
exports.remove=function (req, res) {
    console.log(req.query)
    adDao.remove(req.query._id,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
        //更新fair
//        fairDao.removeAdByOne(req.query.fairId,req.query.type,req.query._id,function(err,doc){
//            if(err){
//                return res.json(response.buildError(err.code));
//            }
//            res.json(response.buildOK());
//        })
    });
};
