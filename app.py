from flask import *
import mysql.connector
import data.config as config
#For coonnection pool
from mysql.connector import pooling
pool=pooling.MySQLConnectionPool
import jwt
import datetime
import requests
import random
import string


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.secret_key="abc" #For session

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def member():
	return render_template("member.html")
@app.route("/orderInfo/<orderNumber>")
def orderInfo(orderNumber):
	return render_template("orderInfo.html")

#connect pooling
connectionPool=pool(
	pool_name="mysqlpool",
	pool_size=10,
	pool_reset_session=True,#reset session varialbes when the connection is returned to the pool
	host=config.mysql["host"],
	user=config.mysql["user"],
	password=config.mysql["password"],
	database="taipeiAttraction",
	buffered=True #for多個游標時，將游標存在緩衝區
	)


@app.route("/api/attractions/", methods=["GET"])
def page():
	mydb=connectionPool.get_connection()
	keyword=request.args.get("keyword")
	# print(type(getData)) #資料型態list
	page=request.args.get("page") #request.args.get得到的值為str, 為了計算使用int，轉換為int	
	page=int(page)
	x=page*12
	mycursor=mydb.cursor()
	pageList=[]
	try:
		if(keyword==None):
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction LIMIT %s,12",(x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0): #當資料小於12或是沒有資料時，nextPage=null
				page=page+1
			else:
				page=None			
			# print(range(len(getData)))
			for j in range(len(getData)):
				result={
				"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
		elif(type(keyword)==str):
			keyword='%'+keyword+'%' #模糊查詢結構
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction WHERE name LIKE %s LIMIT %s,12",(keyword, x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0):
				page=page+1
			else:
				page=None
			for j in range(len(getData)):
				result={
				"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/attraction/<id>", methods=["GET"])
def attractionId(id):
	mydb=connectionPool.get_connection() 	
	try:
		mycursor=mydb.cursor()
		mycursor.execute("SELECT * FROM attraction WHERE id= %s",(id,))
		getData=mycursor.fetchall()
		result={
			"data":{
			"id":getData[0][0], 
			"name":getData[0][1],
			"category":getData[0][2],
			"description":getData[0][3],
			"address":getData[0][4],
			"transport":getData[0][5],
			"mrt":getData[0][6],
			"latitude":getData[0][7],
			"longitude":getData[0][8],
			"images":getData[0][9].split(","),#處理圖片位址str to list
			}
		}
		return jsonify(result)
	except IndexError:
		errorMes={
			"error":True,
			"message":"景點編號錯誤"
		}
		return jsonify(errorMes)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

#flask session
# @app.route("/api/user", methods=["GET"])
# def checkName():
# 	try:
# 		mydb=connectionPool.get_connection()
# 		mycursor=mydb.cursor()
# 		email=session.get("email")
# 		print(session)
# 		print('email' in session)
# 		if 'email' in session:
# 			mycursor.execute("SELECT id, name, email from member WHERE email=%s", (email,))
# 			getData=mycursor.fetchall()
# 			print(getData[0][0])
# 			result={
# 				"data":{
# 					"id":getData[0][0],
# 					"name":getData[0][1],
# 					"email":getData[0][2]
# 				}
# 			}
# 			return jsonify(result)
# 		else:
# 			print(email)
# 			result={
# 				"data":None
# 			}
# 			return jsonify(result)
# 	finally:
# 		if mydb.is_connected():
# 			mycursor.close()
# 			mydb.close()
# 			print("mybd connection is closed")
#JWT 後端設置cookie
@app.route("/api/user", methods=["GET"])
def checkName():
	try:
		mydb=connectionPool.get_connection()
		mycursor=mydb.cursor()
		token=request.cookies.get('access_token')
		print(bool(token) is True)
		
		while bool(token) is True:
			session=jwt.decode(token, "secret", algorithms=["HS256"])
			print("checkName: "+str(session))
			status=session['status']
			if status == '已登入':
				print('email is not null')
				email=session['email']
				mycursor.execute("SELECT id, name, email from member WHERE email=%s", (email,))
				getData=mycursor.fetchall()
				print(getData[0][0])
				result={
					"data":{
						"id":getData[0][0],
						"name":getData[0][1],
						"email":getData[0][2]
					}
				}
				return jsonify(result)
			else:
				break
		result={
			"data":None
		}
		return jsonify(result)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/user", methods=["POST"])
def signup():
	Name=request.form["name"]
	Email=request.form["email"]
	Password=request.form["password"]

	mydb=connectionPool.get_connection()
	mycursor=mydb.cursor()
	mycursor.execute("SELECT email from member WHERE email=%s", (Email,))
	checkEmail=mycursor.fetchall()
	print("name:"+Name)
	print("Email:"+Email)
	print("password:"+Password)
	print(Email=="")
	print(checkEmail)
	print(Email in str(checkEmail))

	try:
		if Name=="" or Email=="" or Password=="":
			result={
				"error":True,
				"message":"姓名或email或密碼不可為空"
			}
			return jsonify(result, 400)
		elif Email in str(checkEmail):
			result={
				"error":True,
				"message":"email已被註冊"
			}
			return jsonify(result, 400)
		else:
			sql="INSERT INTO member(name, email, password) VALUES(%s, %s, %s)"
			val=(Name, Email, Password)
			mycursor.execute(sql, val)
			mydb.commit()
			print(mycursor.rowcount, "record inserted.")
			result={
				"ok":True,
				"message":"註冊成功"
			}
			return jsonify(result, 200)
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(result, 500)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

# Flask session
# @app.route("/api/user", methods=["PATCH"])
# def signin():
# 	email=request.form["email"]
# 	password=request.form["password"]
# 	mydb=connectionPool.get_connection()
# 	mycursor=mydb.cursor()
# 	mycursor.execute("SELECT name FROM member WHERE email=%s and password=%s", (email,password))
# 	userCheck=mycursor.fetchall()
# 	try:
# 		if userCheck==[]:
# 			condition="未登入"
# 			session["status"]=condition
# 			result={
# 				"error":True,
# 				"message":"帳號、或密碼輸入錯誤"
# 			}
# 			return jsonify(result, 400)
# 		elif email=="" or password=="":
# 			condition="未登入"
# 			session["status"]=condition
# 			result={
# 				"error":True,
# 				"message":"帳號、或密碼不可空白"
# 			}
# 			return jsonify(result, 400)
# 		else:
# 			condition="已登入"
# 			session["status"]=condition
# 			session["email"]=email
# 			session["password"]=password
# 			result={
# 				"ok":True
# 			}
# 			return jsonify(result, 200)
# 	except:
# 		result={
# 			"error":True,
# 			"message":"伺服器內部錯誤"
# 		}
# 		return jsonify(result, 500)
# 	finally:
# 		if mydb.is_connected():
# 			mycursor.close()
# 			mydb.close()
# 			print("mybd connection is closed")

#JWT cookie set in backend
@app.route("/api/user", methods=["PATCH"])
def signin():
	email=request.form["email"]
	password=request.form["password"]
	print(password)
	mydb=connectionPool.get_connection()
	mycursor=mydb.cursor()
	#驗證帳密是否正確
	mycursor.execute("SELECT name FROM member WHERE email=%s and password=%s", (email,password))
	userCheck=mycursor.fetchall()
	current_date=datetime.date.today()
	time_delta=datetime.timedelta(days=7)
	exp_day=current_date+time_delta
	exp=datetime.datetime.strptime(str(exp_day),"%Y-%m-%d").timestamp()

	try:
		if userCheck==[]:
			condition="未登入"
			de_order_code_jwt={"status":condition, "exp":exp}
			encoded_jwt=jwt.encode(de_order_code_jwt, "secret", algorithm="HS256")
			result={
				"error":True,
				"message":"帳號、或密碼輸入錯誤"
			}
			resp = make_response(result,200)
			resp.set_cookie("access_token", encoded_jwt)
			print("未登入1")
			return resp
		elif email=="" or password=="":
			condition="未登入"
			de_order_code_jwt={"status":condition, "exp":exp}
			encoded_jwt=jwt.encode(de_order_code_jwt, "secret", algorithm="HS256")
			result={
				"error":True,
				"message":"帳號、或密碼不可空白"
			}
			resp = make_response(result,200)
			resp.set_cookie("access_token", encoded_jwt)
			print("未登入2")
			return resp
		else:
			condition="已登入"
			de_order_code_jwt={"status":condition, "email":email, "exp":exp}
			encoded_jwt=jwt.encode(de_order_code_jwt, "secret", algorithm="HS256")
			result={
				"ok":True
			}
			resp = make_response(result,200)
			resp.set_cookie("access_token", encoded_jwt)
			print("succcess")
			return resp
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤",
		}
		return jsonify(result, 500)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

#後端設置cookie
@app.route("/api/user", methods=["DELETE"])
def logout():
	print('logout')
	token=request.cookies.get('access_token')
	de_order_code_jwt=jwt.decode(token, "secret", algorithms=['HS256'])
	de_order_code_jwt.pop("email", None)
	de_order_code_jwt["status"]="未登入"
	print(de_order_code_jwt)
	encoded_jwt=jwt.encode(de_order_code_jwt, "secret", algorithm='HS256')
	result={
		"ok":True
	}
	resp = make_response(result,200)
	resp.set_cookie("access_token", encoded_jwt)
	
	return resp

@app.route("/api/booking", methods=["GET"])
def booking_check():
	mydb=connectionPool.get_connection()
	mycursor=mydb.cursor()
	access_token=request.cookies.get('access_token')
	print(access_token)
	de_access_code_jwt=jwt.decode(access_token, "secret", algorithms=['HS256'])
	status=de_access_code_jwt["status"]
	print(status)
	print("booking_check: "+str(status))
	try:
		while status=="已登入":
			order_token=request.cookies.get('order_token')
			print(order_token)
			print(bool(order_token) is True)
			if bool(order_token) is True:
				de_order_code_jwt=jwt.decode(order_token, "secret", algorithms=['HS256'])
				print(de_order_code_jwt)
				id=de_order_code_jwt["id"]
				date=de_order_code_jwt["date"]
				time=de_order_code_jwt["time"]
				price=de_order_code_jwt["price"]
				mycursor.execute("SELECT id, name, address, imageUrl FROM attraction WHERE id= %s", (id,))
				get_data=mycursor.fetchall()
				result={
					"data":{
						"attraction":{
							"id":get_data[0][0],
							"name":get_data[0][1],
							"address":get_data[0][2],
							"images":get_data[0][3].split(",")[0]
						},
						"date":date,
						"time":time,
						"price":price
					}
				}
				return jsonify(result, 200)
			elif bool(order_token) is False:
				print("token is false")
				result={
					"ok":True,
					"message":"沒有待預定行程"
				}
				return jsonify(result, 200)
			else:
				break
		result={
			"error":True,
			"message":"請先登入"
		}
		return jsonify(result,400)
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤",
		}
		return jsonify(result, 500)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("Mydb connection is closed")

@app.route("/api/booking", methods=["POST"])
def booking_created():
	token=request.cookies.get('access_token')
	current_date=datetime.date.today()
	time_delta=datetime.timedelta(days=7)
	exp_day=current_date+time_delta
	exp=datetime.datetime.strptime(str(exp_day), "%Y-%m-%d").timestamp()
	print(exp_day)

	try:
		while bool(token) is True:
			de_order_code_jwt=jwt.decode(token, "secret", algorithms=['HS256'])
			status=de_order_code_jwt["status"]
			print(status)
			id=request.headers["attractionId"]
			print(id)
			date=request.form["date"]
			print(date)
			print(bool(date) is True)
			time=request.form["time"]
			print(time)
			price=request.headers["price"]
			print(price)
			if status=="已登入" and bool(date) is True:
				print("test")
				order={"id":id, "date":date, "time":time, "price":price, "exp":exp}
				encoded_order=jwt.encode(order, "secret", algorithm="HS256")
				print(encoded_order)
				result={
					"ok":True,
				}
				resp=make_response(result, 200)
				resp.set_cookie("order_token", encoded_order)
				return resp
			elif status=="已登入" and bool(date) is False:
				print("no date")
				result={
					"error":True,
					"message":"請選擇日期"
				}
				return jsonify(result, 400)
			else:
				break
		result={
			"error":True,
			"message":"請先登入"
		}
		return jsonify(result, 403)
	except:
		result={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(result, 500)
	# finally:
	#  	if mydb.is_connected():
	# 		mycursor.close()
	# 		mybd.close()
	# 		print("Mydb connection is closed")

@app.route("/api/booking", methods=["DELETE"])
def delete_booking():
	token=request.cookies.get('access_token')
	de_order_code_jwt=jwt.decode(token, "secret", algorithms=['HS256'])
	status=de_order_code_jwt["status"]
	if status=="已登入":
		result={
			"ok":True
		}
		resp=make_response(result, 200)
		resp.set_cookie('order_token', '')
		return resp
	else:
		result={
			"error":True,
			"message":"請先登入"
		}
		return jsonify(result, 403)

@app.route("/api/orders", methods=["POST"])
def orders():
	access_token=request.cookies.get('access_token')
	while bool(access_token) is True:
		de_access_code_jwt=jwt.decode(access_token, "secret", algorithms=['HS256'])
		status=de_access_code_jwt["status"]
		order_token=request.cookies.get('order_token')
		de_order_code_jwt=jwt.decode(order_token, "secret", algorithms=['HS256'])
		price=de_order_code_jwt["price"]
		if status=="已登入":
			mobilePhone=request.form["mobilePhone"]
			name=request.form["name"]
			email=request.form["email"]
			if mobilePhone=="" or name=="" or email=="":
				result={
					"error":True,
					"message":"訂單建立失敗，請確認聯絡資訊"
				}
				return jsonify(result, 400)
			else:
				prime=request.headers["prime"]
				print(prime)
				today=datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
				count=''.join(random.sample(string.digits, 3))
				print(count)
				number=today+str(count)
				print(number)
				condition="未付款"
				session["status"]=condition
				#呼叫tappay api
				url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
				Header={
					'content-Type':"application/json",
					'x-api-key':"partner_d2MH38fWyC3rCIJ08g74XW70n54IKsIfNPnogUaaVn7Qt2qTuJ0uFdV8"
				}
				data={
					"prime":prime,
					"partner_key":"partner_d2MH38fWyC3rCIJ08g74XW70n54IKsIfNPnogUaaVn7Qt2qTuJ0uFdV8",
					"merchant_id":"Yo7_CTBC",
					"amount":price,
					"details":"taipei day trip",
					"cardholder":{
						"phone_number":mobilePhone,
						"name":name,
						"email":email
					},
					"instalment":0,
					"remember":False
				}
				post_req=requests.post(url, headers=Header, data=json.dumps(data))
				session["pay_status"]=post_req.json()["status"]
				print(post_req.json()["status"])
				try:
					if session["pay_status"]==0:
						condition="付款成功"
						session["status"]=condition
						print(session["status"])
						id=de_order_code_jwt["id"]
						date=de_order_code_jwt["date"]
						time=de_order_code_jwt["time"]
						print(id+date+time)
						mydb=connectionPool.get_connection()
						cursor=mydb.cursor()
						sql="INSERT INTO booking (bookingNumber, email, name, phoneNumber, attractionId, date, time, price) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
						val=(number, email, name, mobilePhone, id, date, time, price)
						cursor.execute(sql, val)
						mydb.commit()
						print(cursor.rowcount, "record inserted.")
						result={
							"data":{
								"number":number,
								"payment":{
									"status":session["pay_status"],
									"message":session["status"]
								}
							}
						}
						return jsonify(result, 200)
					else:
						result={
							"number":number,
							"error":True,
							"message":"付款失敗"
						}
						return jsonify(result, 400)
				except:
					result={
						"error":True,
						"message":"內部伺服器錯誤"
					}
					return jsonify(result, 500)
				finally:
					if mydb.is_connected():
						cursor.close()
						mydb.close()
						print("Mydb connection is closed")
		else:
			result={
				"error":True,
				"message":"請先登入"
			}
		return jsonify(result, 403)
	result={
		"error":True,
		"message":"請先登入"
	}
	return jsonify(result, 403)
	

@app.route("/api/order/<orderNumber>", methods=["GET"])
def done_order(orderNumber):
	access_token=request.cookies.get('access_token')
	while bool(access_token) is True:
		de_access_code_jwt=jwt.decode(access_token, "secret", algorithms=['HS256'])
		status=de_access_code_jwt["status"]
		if status =="已登入":
			order_token=request.cookies.get('order_token')
			de_order_code_jwt=jwt.decode(order_token, "secret", algorithms=['HS256'])
			date=de_order_code_jwt["date"]
			time=de_order_code_jwt["time"]
			price=de_order_code_jwt["price"]
			id=de_order_code_jwt["id"]
			mydb=connectionPool.get_connection()
			cursor=mydb.cursor()
			cursor.execute("SELECT name, address, imageUrl FROM attraction WHERE id=%s", (id,))
			get_data=cursor.fetchone()
			cursor.execute("SELECT name, email, phoneNumber FROM booking WHERE bookingNumber=%s", (orderNumber,))
			contact=cursor.fetchone()
			print(contact)
			cursor.close()
			mydb.close()
			print("Mydb connection is closed")
			result={
				"data":{
					"number":orderNumber,
					"price":price,
					"trip":{
						"attraction":{
							"id":id,
							"name":get_data[0],
							"address":get_data[1],
							"images":get_data[2].split(",")[0]
						},
						"date":date,
						"time":time,
					},
					"contact":{
						"name":contact[0],
						"email":contact[1],
						"phone":contact[2]
					},
					"status":session["pay_status"]
				}
			}
			return jsonify(result, 200)
		else:
			result={
				"error":True,
				"message":"請先登入"
			}
			return jsonify(result, 403)
@app.route("/api/member", methods=['GET'])
def getMemberInfo():
	access_token=request.cookies.get('access_token')
	while bool(access_token) is True:
		de_access_code_jwt=jwt.decode(access_token, "secret", algorithms=['HS256'])
		status=de_access_code_jwt["status"]
		orderList=[]
		try:
			if status =="已登入":
				email=request.headers["email"]
				mydb=connectionPool.get_connection()
				cursor=mydb.cursor()
				cursor.execute("SELECT name, email FROM member WHERE email=%s", (email,))
				memberInfo=cursor.fetchone()
				cursor.execute("SELECT bookingNumber, date, price FROM booking WHERE email=%s", (email,))
				orderInfo=cursor.fetchall()
				for i in range(len(orderInfo)):
					result={
							"bookingNumber":orderInfo[i][0],
							"date":orderInfo[i][1],
							"price":orderInfo[i][2]
					}
					orderList.append(result)
				data={
					"data":{
							"memberInfo":{
								"name":memberInfo[0],
								"email":memberInfo[1]
							},
							"orderInfo":orderList
					}
				}
				print(data)
				return jsonify(data, 200)
		except:
			result={
				"error":True, "message":"內部伺服器錯誤"
			}
			return jsonify(result, 500)
		finally:
			if mydb.is_connected:
				cursor.close()
				mydb.close()
				print("mybd connection is closed")
	result={
			"error":True, "message":"請先登入"
		}
	return jsonify(result, 400)

@app.route("/api/member/<orderNumber>", methods=['GET'])
def getOrderinfo(orderNumber):
	access_token=request.cookies.get('access_token')
	while bool(access_token) is True:
		de_access_code_jwt=jwt.decode(access_token, "secret", algorithms=['HS256'])
		status=de_access_code_jwt["status"]
		try:
			if status =="已登入":
				mydb=connectionPool.get_connection()
				cursor=mydb.cursor()
				cursor.execute("SELECT attractionId, name, date, time, price FROM booking WHERE bookingNumber=%s", (orderNumber,))
				orderInfo=cursor.fetchone()
				id=orderInfo[0]
				cursor.execute("SELECT name, address, imageUrl FROM attraction WHERE id=%s", (id,))
				attractionInfo=cursor.fetchone()
				result={
					"data":{
						"userName":orderInfo[1],
						"attraction":{
							"id":id,
							"name":attractionInfo[0],
							"address":attractionInfo[1],
							"images":attractionInfo[2].split(",")[0]
						},
						"date":orderInfo[2],
						"time":orderInfo[3],
						"price":orderInfo[4]
					}
				}
				return jsonify(result, 200)
		except:
			result={
				"error":True,
				"message":"內部伺服器錯誤"
			}
			return jsonify(result, 500)
		finally:
			if mydb.is_connected():
				cursor.close()
				mydb.close()
				print("mydb connection is closed")
	result={
			"error":True, "message":"請先登入"
		}
	return jsonify(result, 400)


app.run(host='0.0.0.0', port=3000, debug=True)