/*
 * Copyright (c) 2014 Mounir Boudraa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
