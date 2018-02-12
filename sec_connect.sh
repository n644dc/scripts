#!/bin/bash

ESSID='your_ssid'
PASSW='yourpasswd'
IFACE=wlo1

# Install Tools
apt install wpasupplicant openvpn -y

# Kill unblock and reset wifi
rfkill unblock wifi
systemctl stop NetworkManager
systemctl disable NetworkManager

# Generate Random MAC
hexchars="0123456789ABCDEF"
end=$( for i in {1..10} ; do echo -n ${hexchars:$(( $RANDOM % 16 )):1} ; done | sed -e 's/\(..\)/:\1/g' )
MAC=00$end

# Take wifi interface down
ifconfig $IFACE down

# Reset MAC
ifconfig $IFACE hw ether $MAC
echo 'Using MAC:' $MAC

# Disable IPv6
if grep -Fxq 'net.ipv6.conf.all.disable_ipv6 = 1' /etc/sysctl.d/99-sysctl.conf
then
	echo 'ipv6 already disabled'
else
	echo 'net.ipv6.conf.all.disable_ipv6 = 1' >> /etc/sysctl.d/99-sysctl.conf
	echo 'net.ipv6.conf.default.disable_ipv6 = 1' >> /etc/sysctl.d/99-sysctl.conf
	echo 'net.ipv6.conf.lo.disable_ipv6 = 1' >> /etc/sysctl.d/99-sysctl.conf

fi
sysctl -p

# Bring interface back up
ifconfig $IFACE up


# WPA Setup
wpa_passphrase $ESSID $PASSWD | tee /etc/wpa_suppliant.conf

# Connect and put in background
wpa_supplicant -B -c /etc/wpa_supplicant.conf -i $IFACE

dhclient $IFACE







