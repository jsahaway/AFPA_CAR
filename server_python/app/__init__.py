import MySQLdb #Pour utiliser mysql

from flask import abort, Flask, render_template #Pour utiliser les fonctions nommees
from flask_bootstrap import Bootstrap
from flask_login import LoginManager 
from flask_sqlalchemy import SQLAlchemy #ORM

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py')

    Bootstrap(app)
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_message = "You must be logged in to access this page."
    login_manager.login_view = "auth.signin"

    #from app import usermodel #Pour recuperer les classes
    
    from users import user_service, usermodel
    #from .Services.user_service import UserService
    
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    from .home import home as home_blueprint
    app.register_blueprint(home_blueprint)
    
    from .tripsdriver import tripsdriver as tripsdriver_blueprint
    app.register_blueprint(tripsdriver_blueprint)
    
    from .trippassager import trippassager as trippassager_blueprint
    app.register_blueprint(trippassager_blueprint)    

    @app.errorhandler(403)
    def forbidden(error):
        return render_template('errors/403.html', title='Forbidden'), 403

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('errors/404.html', title='Page Not Found'), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template('errors/500.html', title='Server Error'), 500
    
    @app.route('/500')
    def error():
        abort(500)    

    return app