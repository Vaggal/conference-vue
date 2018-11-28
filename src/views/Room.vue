<template>
    <div class="home">
        <div style="padding: 17px; padding-top: 0px;">
            <span
                v-show="error"
            >Allow the browser to use your web cam and after that share the URL from the address bar with the people you want to talk with.</span>
            <br>
            <span v-bind="error"></span>
        </div>

        <div class="video-wrapper">
            <div class="col-md-4" v-for="(peer, key) in peers" :key="key">
                <video-player></video-player>
            </div>
        </div>

        <div class="video-wrapper">
            <div class="col-md-2">
                <video id="videoLocal" autoplay muted></video>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import VideoPlayer from './../components/VideoPlayer.vue';

export default {
    name: 'room',
    data: function () {
        return {
            error: true
        };
    },
    components: { VideoPlayer }
};
</script>
