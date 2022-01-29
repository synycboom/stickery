# Stickery Backend

## Development Preparation
- This service needs MySQL, and we can be simply use it from docker-compose.db.yaml file for development
```shell
# open another shell session
$ docker-compose -f docker-compose.db.yaml up
```

- Setup create .env file and set the variables
```shell
$ cat .env.example > .env 
```

## Development
- Make sure that node >= 14 has been installed
```shell
# install dependencies
$ npm ci
# run development server
$ npm run dev
```

## Miscellaneous
- https://app.mycrypto.com/sign-message
