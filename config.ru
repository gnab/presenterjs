require 'sinatra'

get '/' do
  redirect '/index.html'
end

run Sinatra::Application
