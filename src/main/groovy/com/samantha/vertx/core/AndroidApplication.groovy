package com.samantha.vertx.core

class AndroidApplication {
    private String version;
    private String label;
    private String logo;
    private String packageName;
    private int uid;
    private boolean debuggable

    String getVersion() {
        return version
    }

    void setVersion(String version) {
        this.version = version
    }

    String getLabel() {
        return label
    }

    void setLabel(String label) {
        this.label = label
    }

    String getLogo() {
        return logo
    }

    void setLogo(String logo) {
        this.logo = logo
    }

    String getPackageName() {
        return packageName
    }

    void setPackageName(String packageName) {
        this.packageName = packageName
    }

    int getUid() {
        return uid
    }

    void setUid(int uid) {
        this.uid = uid
    }

    boolean getDebuggable() {
        return debuggable
    }

    void setDebuggable(boolean debuggable) {
        this.debuggable = debuggable
    }
}
