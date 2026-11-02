FROM docker.io/nodered/node-red:5.0.4

USER root
RUN mkdir -p /data && chown -R node-red:root /data
USER node-red
WORKDIR /data

COPY --chown=node-red:node-red package.json /data/package.json
RUN npm install --omit=dev --no-audit --no-fund

COPY --chown=node-red:node-red settings.js /data/settings.js
COPY --chown=node-red:node-red flows.json /data/flows.json
COPY --chown=node-red:node-red generate-credentials.js /data/generate-credentials.js
COPY --chown=node-red:node-red docker-entrypoint.sh /data/docker-entrypoint.sh

USER root
RUN chmod +x /data/docker-entrypoint.sh
USER node-red

ENV TZ=America/Bogota
ENV NODE_RED_LOG_LEVEL=info
ENV PORT=1880

EXPOSE 1880

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||1880)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/data/docker-entrypoint.sh"]
CMD ["node-red", "--userDir", "/data", "--settings", "/data/settings.js"]
