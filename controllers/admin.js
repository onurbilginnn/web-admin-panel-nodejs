const { validationResult } = require('express-validator');

const fileHelper = require('../util/file');
const ImgTxt = require('../models/img-txt');
const ImgOnly = require('../models/img-only');
const TxtOnly = require('../models/txt_only');
const Article = require('../models/article');

const ITEMS_PER_PAGE = 1;

exports.getPanel = (req, res, next) => {	
	const imgTxtHeaders = new Array();
	const imgTxtElements = new Array();
	const imgOnlyHeaders = new Array();
	const imgOnlyElements = new Array();
	const txtOnlyHeaders = new Array();
	const txtOnlyElements = new Array();
	const tableNames = ['img-txt', 'img-only', 'txt-only'];
	const page = req.query.loc;

	ImgTxt.findAll({
		where:{page: page},
		order:[['header', 'ASC']]	
	})
		.then((elements) => {				
			return elements.forEach((el) => {
				if (!imgTxtHeaders.includes(el.header)) {
					imgTxtHeaders.push(el.header);
				}
				imgTxtElements.push(el);				
			});
		})
		.then(response => {
			return ImgOnly.findAll({
				where:{page: page},
				order:[['header', 'ASC']]
			})
					.then((elements) => {
						elements.forEach((el) => {
							if (!imgOnlyHeaders.includes(el.header)) {
								imgOnlyHeaders.push(el.header);
							}
							imgOnlyElements.push(el);
						});
					})
					.catch((err) => console.log(err));
		})
		.then(response => {
			return TxtOnly.findAll({
				where:{page: page},
				order:[['header', 'ASC']]
			})
					.then((elements) => {
						elements.forEach((el) => {
							if (!txtOnlyHeaders.includes(el.header)) {
								txtOnlyHeaders.push(el.header);
							}
							txtOnlyElements.push(el);
						});
					})
					.catch((err) => console.log(err));
		})
		.then(response => {
			const allElements = imgTxtElements.concat(imgOnlyElements).concat(txtOnlyElements);

			res.render('admin/pages/panel', {
				pageTitle: 'Home Panel',
				path: '/admin/pages/panel',
				companyName: req.app.locals.companyName,
				page: page,
				allElements: allElements,
				imgTxtHeaders: imgTxtHeaders,
				imgTxtElements: imgTxtElements,
				imgOnlyHeaders: imgOnlyHeaders,
				imgOnlyElements: imgOnlyElements,
				txtOnlyHeaders: txtOnlyHeaders,
				txtOnlyElements: txtOnlyElements,
				tableNames: tableNames,
			});
		})
		.catch((err) => console.log(err));			
};

exports.getAddData = (req, res, next) => {
	const pageTableSelect = req.params.pageTableSelect;
	const page = pageTableSelect.split('_')[0];
	const tableSelect = pageTableSelect.split('_')[1];
	return res.render('admin/main/add-data', {
		pageTitle: 'Add Data',
		path: '/admin/main/add-table',
		companyName: req.app.locals.companyName,
		page: page,
		tableSelect: tableSelect,
		edit: false,
		oldInput: {
			type: '',
			typeOrder: '',
			txt: '',
			description:''
		},
		errorMessage: '',
		validationErrors: []
	});
};

exports.getEditData = (req, res, next) => {
	const elementIdPageTableName = req.params.elementIdPageTableName;
	const edit = req.query.edit;
	const elementId = elementIdPageTableName.split('_')[0];
	const tableSelect = elementIdPageTableName.split('_')[2];

	if (!edit || !tableSelect) {
		return res.redirect('/admin/main/pages/' + 'page' + '-panel');
	  }

	switch (tableSelect) {
		case 'img-txt':		
			ImgTxt.findAll({where: {id: elementId}})
				.then(elements => {
					const element = elements[0];
					if(!element){
						return res.redirect('/admin/main/pages/' + 'page' + '-panel');
					}
					 res.render('admin/main/add-data', {
						pageTitle: 'Edit Data',
						path: '/admin/main/edit-data',
						companyName: req.app.locals.companyName,
						tableSelect: tableSelect,
						page: element.page,
						element: element,
						edit: edit,
						errorMessage: '',
						validationErrors: []
					});
				})
				.catch((err) => console.log(err));	
				case 'img-only':		
			ImgOnly.findAll({where: {id: elementId}})
				.then(elements => {
					const element = elements[0];
					if(!element){
						return res.redirect('/admin/main/pages/' + 'page' + '-panel');
					}
					 res.render('admin/main/add-data', {
						pageTitle: 'Edit Data',
						path: '/admin/main/edit-data',
						companyName: req.app.locals.companyName,
						tableSelect: tableSelect,
						page: element.page,
						element: element,
						edit: edit,
						errorMessage: '',
						validationErrors: []
					});
				})
				.catch((err) => console.log(err));
				case 'txt-only':		
			TxtOnly.findAll({where: {id: elementId}})
				.then(elements => {
					const element = elements[0];
					if(!element){
						return res.redirect('/admin/main/pages/' + 'page' + '-panel');
					}
					 res.render('admin/main/add-data', {
						pageTitle: 'Edit Data',
						path: '/admin/main/edit-data',
						companyName: req.app.locals.companyName,
						tableSelect: tableSelect,
						page: element.page,
						element: element,
						edit: edit,
						errorMessage: '',
						validationErrors: []
					});
				})
				.catch((err) => console.log(err));					
	}
};

exports.getArticlesPanel = (req, res, next) => {
		// *** Pagination Vars ***
		const currentPage = +req.query.currentPage || 1;
		let totalItems;
		// *** Pagination Vars ***
		Article
		.count({where:{userId: req.user.id}})
		.then(num => {
			totalItems = num;	
		return req.user
		.getArticles({
			where:{userId: req.user.id},
			order:[['title', 'ASC']],
			offset: (currentPage - 1) * ITEMS_PER_PAGE,
			limit: ITEMS_PER_PAGE
		})
		.then(articles => {	
			return res.render('admin/pages/articles-panel', {
				pageTitle: 'Articles',
				path: '/admin/pages/articles-panel',
				companyName: req.app.locals.companyName,
				page: 'articles',
				articles: articles,
				currentPage: currentPage,
				hasNextPage: ITEMS_PER_PAGE * currentPage < totalItems,
				hasPreviousPage: currentPage > 1,
				nextPage: currentPage + 1,
				previousPage: currentPage - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch(err => console.log(err));
	})	
};

exports.getAddArticle = (req, res, next) => {
	return res.render('admin/main/add-article', {
		pageTitle: 'Add Article',
		path: '/admin/main/add-article',
		companyName: req.app.locals.companyName,
		page: 'articles',
		createDate: new Date().toISOString().substr(0, 10),
		edit: false,
		errorMessage:'',
		oldInput:{
			title: '',
			postedBy: '',
			email: '',
			category: '',
			readTime: '',
			imageUrl: '',
			tags: '',
			tagsArray: [],
			article: ''
		},
		validationErrors: []
	});
};

exports.getEditArticle = (req, res, next) => {
	const articleId = req.params.articleId;
	const edit = req.query.edit;
	const page = 'articles';

			req.user.getArticles({where: {id: articleId}})
				.then(articles => {
					const article = articles[0];
					if(!article){
						return res.redirect('/admin/main/pages/articles-panel');
					}
					 res.render('admin/main/add-article', {
						pageTitle: 'Edit Article',
						path: '/admin/main/edit-article',
						page: page,
						companyName: req.app.locals.companyName,
						article: article,
						edit: edit,
						errorMessage: '',
						validationErrors: []
					});
				})
				.catch((err) => console.log(err));	
							
};

exports.postAddArticle = (req, res, next) => {
	const title = req.body.title;
	const postedBy = req.body.postedBy;
	const email = req.body.email;
	const category = req.body.category;
	const readTime = req.body.readTime;
	const image = req.file;
	const tags = req.body.tags;
	const article = req.body.article;
	let imageUrl = '';

	if(image) {		
		imageUrl = image.path;
	}

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.render('admin/main/add-article', {
			pageTitle: 'Add Article',
			path: '/admin/main/add-article',
			companyName: req.app.locals.companyName,
			page: 'Articles',
			edit: false,
		createDate: new Date().toISOString().substr(0, 10),
			oldInput:{
				title: title,
				postedBy: postedBy,
				email: email,
				category: category,
				readTime: readTime,
				imageUrl: imageUrl,
				tags: tags,
				tagsArray: tags.split(','),
				article: article
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	req.user
	.createArticle({title: title,
		postedBy: postedBy,
		email: email,
		category: category,
		readTime: readTime,
		imageUrl: imageUrl,
		tags: tags,
		article: article
	})
	.then(result => {
		// console.log(result);
		console.log('Created Article');
		res.redirect('/admin/pages/articles-panel');
	  })
	  .catch(err => {
		console.log(err);
	  });
};

exports.postEditArticle = (req, res, next) => {
	const articleId = req.body.articleId;
	const updatedTitle = req.body.title;
	const updatedPostedBy = req.body.postedBy;
	const updatedEmail = req.body.email;
	const updatedCategory = req.body.category;
	const updatedReadTime = req.body.readTime;
	const updatedImage = req.file;
	const updatedTags = req.body.tags;
	const updatedArticle = req.body.article;
	const edit = req.query.edit;
	let updatedImageUrl = req.body.imageUrl;

	if(updatedImage) {		
		updatedImageUrl = updatedImageUrl.path;
	}

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.render('admin/main/add-article', {
			pageTitle: 'Edit Article',
			path: '/admin/main/edit-article',
			companyName: req.app.locals.companyName,
			page: 'Articles',
			edit: true,
		createDate: new Date().toISOString().substr(0, 10),
			article:{
				id: articleId,
				title: updatedTitle,
				postedBy: updatedPostedBy,
				email: updatedEmail,
				category: updatedCategory,
				readTime: updatedReadTime,
				imageUrl: updatedImageUrl,
				tags: updatedTags,
				article: updatedArticle
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	Article
	.findByPk(articleId)
	.then(article => {
		if(!article) {
			return res.redirect('/admin/pages/articles-panel');
		}
		article.title = updatedTitle;
		article.postedBy = updatedPostedBy;
		article.email = updatedEmail;
		article.category = updatedCategory;
		article.readTime = updatedReadTime;
		article.imageUrl = updatedImageUrl;
		article.tags = updatedTags;
		article.article = updatedArticle;
		return article.save();
	})		
	.then(result => {
		// console.log(result);
		console.log('Updated Article');
		res.redirect('/admin/pages/articles-panel');
	  })
	  .catch(err => {
		console.log(err);
	  });
};

exports.postAddData = (req, res, next) => {
	const tableSelect = req.body.tableSelect;
	const page = req.body.page;
	const type = req.body.type;
	const typeOrder = req.body.typeOrder;
	const header = type + '-' + typeOrder;
	const description = req.body.description;	
	const edit = false;
	const txt = req.body.txt;	
	let image;
	let imageUrl;

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.render('admin/main/add-data', {
			pageTitle: 'Add Data',
			path: '/admin/main/add-data',
			companyName: req.app.locals.companyName,
			page: page,
			edit: edit,	
			tableSelect: tableSelect,
			oldInput: {
				type: type,
				typeOrder: typeOrder,
				txt: txt,
				description:description
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	switch (tableSelect) {
		case 'img-txt':
			image = req.file;
			if(!image) {
				return res.render('admin/main/add-data', {
					pageTitle: 'Add Data',
					path: '/admin/main/add-data',
					companyName: req.app.locals.companyName,
					page: page,
					edit: edit,	
					tableSelect: tableSelect,
					oldInput: {
						type: type,
						typeOrder: typeOrder,
						txt: txt,
						description:description
					},
					errorMessage: 'Please attach an image!',
					validationErrors: []
				});
			}
			imageUrl = image.path;
			return ImgTxt.create({
				page: page,
				type: type,
				typeOrder: typeOrder,
				imageUrl: imageUrl,
				header: header,
				txt: txt,
				description: description,
			})
				.then((result) => {
					console.log('ImgTxt created');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		case 'img-only':	
		image = req.file;
		if(!image) {
			return res.render('admin/main/add-data', {
				pageTitle: 'Add Data',
				path: '/admin/main/add-data',
				companyName: req.app.locals.companyName,
				page: page,
				edit: edit,	
				tableSelect: tableSelect,
				oldInput: {
					type: type,
					typeOrder: typeOrder,
					description:description
				},
				errorMessage: 'Please attach an image!',
				validationErrors: []
			});
		}
		imageUrl = image.path;	
			return ImgOnly.create({
				page: page,
				type: type,
				typeOrder: typeOrder,
				header: header,
				imageUrl: imageUrl,
				description: description,
			})
				.then((result) => {
					console.log('ImgOnly created');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		case 'txt-only':
			return TxtOnly.create({
				page: page,
				type: type,
				typeOrder: typeOrder,
				header: header,
				txt: txt,
				description: description,
			})
				.then((result) => {
					console.log('TxtOnly created');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		default:
			throw new Error('Invalid Table!');
	}
};

exports.postEditData = (req, res, next) => {
	const tableSelect = req.body.tableSelect;
	const page = req.body.page;
	const updatedType = req.body.type;
	const updatedTypeOrder = req.body.typeOrder;
	const updatedHeader = updatedType + '-' + updatedTypeOrder;
	const updatedDescription = req.body.description;	
	const elementId = req.body.elementId;	
	const edit = req.query.edit;
	let updatedTxt = req.body.txt;	
	let updatedImageUrl = req.body.imageUrl;
	let image;

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.render('admin/main/add-data', {
			pageTitle: 'Edit Data',
			path: '/admin/main/edit-data',
			companyName: req.app.locals.companyName,
			page: page,
			edit: true,	
			tableSelect: tableSelect,	
			element: {
				id: elementId,
				type: updatedType,
				imageUrl: updatedImageUrl,
				typeOrder: updatedTypeOrder,
				txt: updatedTxt,
				description: updatedDescription
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}
	switch (tableSelect) {
		case 'img-txt':
			image = req.file;
			if(image){
				fileHelper.deleteFile(updatedImageUrl);
				updatedImageUrl = image.path;
			} 	
			return ImgTxt.findByPk(elementId)
			.then(element => {
				element.page = page;
				element.type = updatedType;
				element.typeOrder= updatedTypeOrder;
				element.imageUrl = updatedImageUrl;
				element.header = updatedHeader;
				element.txt = updatedTxt;
				element.description = updatedDescription;
				return element.save();
			})
				.then((result) => {
					console.log('ImgTxt updated');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		case 'img-only':	
		if(image){
			fileHelper.deleteFile(updatedImageUrl);
			updatedImageUrl = image.path;
		}
			return ImgOnly.findByPk(elementId)
			.then(element => {
				element.page = page;
				element.type = updatedType;
				element.typeOrder= updatedTypeOrder;
				element.imageUrl = updatedImageUrl;
				element.header = updatedHeader;
				element.description = updatedDescription
				return element.save();
			})
				.then((result) => {
					console.log('ImgOnly updated');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		case 'txt-only':
			return TxtOnly.findByPk(elementId)
			.then(element => {
				element.page = page;
				element.type = updatedType;
				element.typeOrder= updatedTypeOrder;
				element.header = updatedHeader;
				element.txt = updatedTxt;
				element.description = updatedDescription;
				return element.save();
			})
				.then((result) => {
					console.log('TxtOnly updated');
					res.redirect('/admin/pages/panel?loc='+page);
				})
				.catch((err) => console.log(err));
		default:
			throw new Error('Invalid Table!');
	}
};

exports.deleteData = (req, res, next) => {
	const elementIdTableSelect = req.params.elementIdTableSelect;
	const elementId = elementIdTableSelect.split('_')[0];
	const tableSelect = elementIdTableSelect.split('_')[1];

	switch (tableSelect) {
		case 'img-txt':
			return ImgTxt.findByPk(elementId).then(data => {
			  if(!data) {
				return next(new Error('Data not found.'));
			  }
			  fileHelper.deleteFile(data.imageUrl);
			  return ImgTxt.destroy({where:{id: elementId}});
			})
			  .then(() => {
				console.log('DESTROYED DATA');
				res.status(200).json({message: 'Success'});
			  })  
			  .catch(err => {
				res.status(500).json({message: 'Deleting data failed.'});
			  });
		case 'img-only':	
		return ImgOnly.findByPk(elementId).then(data => {
			if(!data) {
			  return next(new Error('Data not found.'));
			}
			fileHelper.deleteFile(data.imageUrl);
			return ImgOnly.destroy({where:{id: elementId}});
		  })
			.then(() => {
			  console.log('DESTROYED DATA');
			  res.status(200).json({message: 'Success'});
			})  
			.catch(err => {
			  res.status(500).json({message: 'Deleting data failed.'});
			});
		case 'txt-only':
			return TxtOnly.findByPk(elementId).then(data => {
				if(!data) {
				  return next(new Error('Data not found.'));
				}
				return TxtOnly.destroy({where:{id: elementId}});
			  })
				.then(() => {
				  console.log('DESTROYED DATA');
				  res.status(200).json({message: 'Success'});
				})  
				.catch(err => {
				  res.status(500).json({message: 'Deleting data failed.'});
				});
	}
  };

exports.deleteArticle = (req, res, next) => {
	const articleId = req.params.articleId;

			return Article.findByPk(articleId).then(data => {
			  if(!data) {
				return next(new Error('Data not found.'));
			  }
			  if(data.imageUrl !== ''){
				  fileHelper.deleteFile(data.imageUrl);
			  }
			  return Article.destroy({where:{id: articleId}});
			})
			  .then(() => {
				console.log('DESTROYED DATA');
				res.status(200).json({message: 'Success'});
			  })  
			  .catch(err => {
				res.status(500).json({message: 'Deleting data failed.'});
			  });
	
  };