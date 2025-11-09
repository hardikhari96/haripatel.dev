---
title: "Implementing Geo-Fencing with NGINX Reverse Proxy"
date: "2025-08-03"
description: "In many cases, we need to restrict access to our web applications or services based on the location of the user. This is usually done to follow security policies, regional regulations, or vendor requirements."
---

In many cases, we need to restrict access to our web applications or services based on the location of the user. This is usually done to follow security policies, regional regulations, or vendor requirements.

Some teams use third-party services like Cloudflare for this purpose, since they provide built-in geo-fencing features. But that also means routing all traffic through their servers, which can affect performance in production environments.

If you're already using a reverse proxy like NGINX or Apache, you can set up geo-fencing on your own without needing third-party services. This approach gives you more control, eliminates external dependencies, and allows you to log and analyze traffic according to your preferences.

In this blog, I'll walk through how I set up geo-fencing using NGINX and a GeoIP2 database on a self-hosted Ubuntu server.

## Requirements

- Ubuntu server
- NGINX
- GeoIP2 database (from [IPInfo](http://ipinfo.io/))

## Step 1: Install NGINX and Required Packages

First, make sure NGINX is installed. Then install the required modules and tools:

```bash
sudo apt update
sudo apt install libmaxminddb0 libmaxminddb-dev mmdb-bin nginx-module-geoip2 -y
```

## Step 2: Enable the GeoIP2 Module in NGINX

Edit the main NGINX config file:

```bash
sudo nano /etc/nginx/nginx.conf
```

At the top of the file, load the geoip2 module:

```nginx
load_module modules/ngx_http_geoip2_module.so;

http {
    ...
}
```

## Step 3: Download the GeoIP Database

We'll use IPInfo's GeoIP2-compatible database here. Create a folder for it:

```bash
sudo mkdir -p /etc/nginx/geoip
cd /etc/nginx/geoip
```

Download the database (replace `{Token}` with your actual token from [ipinfo.io](http://ipinfo.io/)):

```bash
wget "https://ipinfo.io/data/ipinfo_lite.mmdb?token={Token}" -O ipinfo_lite.mmdb
```

## Step 4: Configure GeoIP2 in NGINX

Now we'll configure NGINX to use this database and block access based on country.

In your server or site config:

```nginx
http {
    geoip2 /etc/nginx/geoip/ipinfo_lite.mmdb {
        auto_reload 5m;
        $ipinfo_country_code default=IN source=$remote_addr country_code;
    }

    map $ipinfo_country_code $allow {
        default no;
        IN yes;  # Allow only India (IN)
    }
}
```

Edit in domain config:

```nginx
server {
    ... 
    location / {   
        if ($allow != yes) {
            return 403;
        }
    }
}
```

This setup blocks all countries except India. You can adjust the country code as per your needs.

## Step 5: Add Logging for Analysis

For debugging or analytics, it helps to log request info in a structured format. Add this to your NGINX config:

```nginx
log_format geo_csv '"$remote_addr","$ipinfo_country_code","$time_local","$request_method","$host","$request_uri","$allow_country","$body_bytes_sent","$http_user_agent"';
access_log /var/log/nginx/geo_access.log geo_csv;
```

This will create logs that you can easily analyze or import into tools like Excel or ELK Stack.

## Step 6: Reload NGINX

After all changes are done, test your config and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Wrap-up

That's it. You now have a basic geo-fencing setup running on your own infrastructure using NGINX. No need to rely on external services like Cloudflare.

This setup is ideal if:

- You want full control over traffic.
- You don't want to route requests through third-party proxies.
- You need detailed logs for auditing or analytics.
