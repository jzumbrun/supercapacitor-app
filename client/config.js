
/**
 * Config
 */
class Config {

    constructor(){
        this.env = ''
    }

    /**
     * getEnv
     */ 
    getEnv(){
        return this.env
    }

    /**
     * Is Local
     */ 
    isLocal(){
        return this.env == 'local'
    }

    /**
     * Is Production
     */ 
    isProduction(){
        return this.env == 'production'
    }

    /**
     * Set Env
     */ 
    setEnv(env){
        if(env){
            this.env = env
            return;
        }
        // Local ends with a .dev
        if(window.location.hostname.match(/.*\.dev$/)){
            this.env = 'local'
        }
        else{
            this.env = 'production'
        }
    }

}

// Config needs to be a singleton thus the new
module.exports = new Config()