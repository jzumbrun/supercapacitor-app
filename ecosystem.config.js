module.exports = {
  apps: [{
    name: 'supercapacitor-app',
    script: 'server/supercapacitor.js',
    exec_mode: 'cluster',
    instances: 2,
    max_memory_restart: '100M',
    merge_logs: true
  },
  {
    name: 'tracking',
    script: 'server/tracking.js',
    max_memory_restart: '100M',
    merge_logs: true,
    exec_mode: 'fork',
    instances: 1 /* !! Keep at one or multiple emails will be sent!! */
  }],
  deploy: {
    production: {
      user: 'root',
      host: ['supercapacitor-app'],
      ref: 'origin/master',
      repo: '...',
      path: '/var/www/supercapacitor-app',
      'post-deploy': './deploy'
    }
  }
}